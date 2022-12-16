import board
import busio
from adafruit_pn532.i2c import PN532_I2C
from threading import Lock
from ntag import NTAG216


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
        # TODO: This is currently broken and needs to be rewritten
        self.write_ntag(NTAG216.from_ndef_message(None))

    @device_lock
    def write_ntag(self, ntag):
        four_byte_data_pages = [ntag[i:i + 4] for i in range(0, len(ntag), 4)]

        for page_number, data in enumerate(four_byte_data_pages, 4):
            if not self.device.ntag2xx_write_block(page_number, data):
                raise RuntimeError('Write failed')
