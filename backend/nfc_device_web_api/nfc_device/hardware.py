import board
import busio
from adafruit_pn532.i2c import PN532_I2C
from threading import Lock
# from ntag import NTAG216


class NFCDevice:
    pass


class PN532:
    hardware_lock = None

    def __init__(self, hardware):
        self._hardware = hardware
        self._hardware_lock = Lock()




    @classmethod
    def __call__(cls, self):
        device = PN532_I2C(busio.I2C(board.SCL, board.SDA))
        device.SAM_configuration()
        return device


    @property
    @device_lock
    def card_in_range(self):
        return True if self.device.read_passive_target() else False

    def erase_ntag(self):
        # TODO: This is currently broken and needs to be rewritten
        self.write_ntag(NTAG216.from_ndef_message(bytes(0)))

    @device_lock
    def write_ntag(self, ntag):
        four_byte_data_pages = [ntag[i:i + 4] for i in range(0, len(ntag), 4)]

        for page_number, data in enumerate(four_byte_data_pages, 4):
            if not self.device.ntag2xx_write_block(page_number, data):
                raise RuntimeError('Write failed')
