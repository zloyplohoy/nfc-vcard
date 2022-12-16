from abc import ABC, abstractmethod


class BaseNTAG(ABC):

    @abstractmethod
    def NTAG_SIZE_BYTES():
        pass

    TLV_TAG_BLOCK = b'\x03'
    TLV_TERMINATOR_BLOCK = b'\xfe'
    TLV_SINGLE_BYTE_LENGTH_MAX_SIZE_BYTES = 255
    TLV_DOUBLE_BYTE_LENGTH_MAX_SIZE_BYTES = 65_535
    TLV_DOUBLE_LENGTH_PREFIX = b'\xff'

    @classmethod
    def from_ndef_message(cls, message):
        ntag_data = cls.wrap_in_tlv(message)
        cls.justify_to_ntag_size(ntag_data)
        return ntag_data

    @classmethod
    def justify_to_ntag_size(cls, ntag_data):
        if len(ntag_data) > cls.NTAG_SIZE_BYTES:
            raise ValueError(f'Message too large for {cls.__name__}')
        return ntag_data.ljust(cls.NTAG_SIZE_BYTES, bytes(1))

    @classmethod
    def wrap_in_tlv(cls, message):
        length_field = cls.get_length_field(len(message))
        return cls.TLV_TAG_BLOCK + length_field + message + cls.TLV_TERMINATOR_BLOCK

    @classmethod
    def get_length_field(cls, message_length):
        if message_length > cls.TLV_DOUBLE_BYTE_LENGTH_MAX_SIZE_BYTES:
            raise ValueError(f'Message too large for {cls.__name__}')
        elif message_length > cls.TLV_SINGLE_BYTE_LENGTH_MAX_SIZE_BYTES:
            length_field = cls.TLV_DOUBLE_LENGTH_PREFIX + message_length.to_bytes(2, byteorder='big')
        else:
            length_field = message_length.to_bytes(1, byteorder='big')
        return length_field
