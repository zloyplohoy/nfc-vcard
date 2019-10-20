import math
import board
import busio
from adafruit_pn532.i2c import PN532_I2C

TLV_NDEF_MESSAGE_TAG = b'\x03'
TLV_DOUBLE_LENGTH_PREFIX = b'\xff'
TLV_TERMINATOR = b'\xfe'
MAX_NDEF_MESSAGE_SIZE = 883
MAX_NTAG_USER_DATA_SIZE = 888


class NTAGWriterError(Exception):
    pass


class NTAGWriter:
    def __init__(self):
        self._reader = PN532_I2C(busio.I2C(board.SCL, board.SDA))
        self._reader.SAM_configuration()

    @property
    def card_in_range(self):
        if self._reader.read_passive_target():
            return True
        return False

    def format_ntag(self):
        while True:
            if self.card_in_range:
                self._write_ndef_raw(bytes(MAX_NTAG_USER_DATA_SIZE))
                self.write_ndef_message()
                break

    def write_ndef_message(self, ndef_message: bytes = None):
        self._write_ndef_raw(self._tlv_wrapper(ndef_message))

    def _write_ndef_raw(self, raw_data: bytes):
        try:
            if not self.card_in_range:
                raise NTAGWriterError('Card not found')
        except Exception as e:
            raise NTAGWriterError('Internal Error: {}'.format(e))

        try:
            for page_number, page_data in enumerate(self._pager(raw_data), 4):
                if not self._reader.ntag2xx_write_block(page_number, page_data):
                    raise NTAGWriterError('Write failed')
        except Exception as e:
            raise NTAGWriterError('Internal Error: {}'.format(e))

    @staticmethod
    def _tlv_wrapper(data: bytes):
        if data:
            if len(data) < 255:
                length_field = len(data).to_bytes(1, 'big')
            elif len(data) < MAX_NDEF_MESSAGE_SIZE:
                length_field = TLV_DOUBLE_LENGTH_PREFIX + len(data).to_bytes(2, 'big')
            else:
                raise NTAGWriterError('Message too long')

            wrapped_message = TLV_NDEF_MESSAGE_TAG + length_field + data + TLV_TERMINATOR
        else:
            wrapped_message = TLV_NDEF_MESSAGE_TAG + bytes(1) + TLV_TERMINATOR

        return wrapped_message

    @staticmethod
    def _pager(data: bytes):
        for i in range(math.ceil(len(data) / 4)):
            page = data[4 * i:4 * i + 4]
            if len(page) < 4:
                page += bytes(4 - len(page))
            yield page
