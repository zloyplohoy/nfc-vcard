import board
import busio
from adafruit_pn532.i2c import PN532_I2C
from threading import Lock


class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(SingletonMeta, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class NFCDevice(metaclass=SingletonMeta):
    def __init__(self):
        self.device = PN532_I2C(busio.I2C(board.SCL, board.SDA))
        self.device.SAM_configuration()
        self._device_lock = Lock()

    def device_lock(function):
        def function_with_lock(*args, **kwargs):
            with args[0]._device_lock:
                return function(*args, **kwargs)
        return function_with_lock

    @property
    @device_lock
    def card_in_range(self):
        return True if self.device.read_passive_target() else False

    def erase_ntag(self):
        self.write_ntag(NTAG216.from_ndef_message(None))

    @device_lock
    def write_ntag(self, ntag):
        four_byte_data_pages = [ntag[i:i + 4] for i in range(0, len(ntag), 4)]

        for page_number, data in enumerate(four_byte_data_pages, 4):
            if not self.device.ntag2xx_write_block(page_number, data):
                raise RuntimeError('Write failed')


class TLV:
    NDEF_MESSAGE_TAG = b'\x03'
    TERMINATOR_TAG = b'\xfe'

    @classmethod
    def wrap_ndef_message(cls, ndef_message):
        if not ndef_message:
            return cls._generate_empty_tlv()
        if len(ndef_message) < 65_535:
            return cls._generate_tlv(ndef_message)
        raise ValueError('Message too long for NTAG TLV block')

    @classmethod
    def _generate_empty_tlv(cls):
        return cls.NDEF_MESSAGE_TAG + bytes(1) + cls.TERMINATOR_TAG

    @classmethod
    def _generate_tlv(cls, data):
        length_field = cls._generate_length_field(data)
        return cls.NDEF_MESSAGE_TAG + length_field + data + cls.TERMINATOR_TAG

    @staticmethod
    def _generate_length_field(data):
        DOUBLE_LENGTH_PREFIX = b'\xff'
        if len(data) < 255:
            return len(data).to_bytes(1, byteorder='big')
        else:
            return DOUBLE_LENGTH_PREFIX + len(data).to_bytes(2, byteorder='big')


class NTAG216:
    MAX_NDEF_MESSAGE_BYTES = 883
    MAX_NTAG_USER_DATA_BYTES = 888

    @classmethod
    def from_ndef_message(cls, ndef_message):
        if ndef_message and len(ndef_message) > cls.MAX_NDEF_MESSAGE_BYTES:
            raise ValueError('NDEF message exceeds NTAG size')
        return TLV.wrap_ndef_message(ndef_message).ljust(cls.MAX_NTAG_USER_DATA_BYTES, bytes(1))
