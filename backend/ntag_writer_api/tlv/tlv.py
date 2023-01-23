from .terminator import TERMINATOR


class TLV:
    _single_byte_length_max_bytes = 255
    _double_byte_length_max_bytes = 65_535
    _double_byte_length_prefix = b'\xff'

    @classmethod
    def wrap(cls, tag, data):
        length_field = cls.get_length_field(data)
        return tag + length_field + data + TERMINATOR

    @classmethod
    def get_length_field(cls, data):
        length = len(data)
        if length <= cls._single_byte_length_max_bytes:
            length_field = cls.get_single_byte_length_field(length)
        elif length <= cls._double_byte_length_max_bytes:
            length_field = cls.get_double_byte_length_field(length)
        else:
            raise ValueError('Data too large to fit in a TLV')
        return length_field

    @staticmethod
    def get_single_byte_length_field(length):
        return length.to_bytes(length=1, byteorder='big')

    @classmethod
    def get_double_byte_length_field(cls, length):
        return b''.join([cls._double_byte_length_prefix,
                         length.to_bytes(length=2, byteorder='big')])


# from abc import ABC, abstractmethod


# class BaseNTAG(ABC):
#     def __init__(data):
#         pass

#     @abstractmethod
#     def NTAG_SIZE_BYTES():
#         pass

#     TLV_TAG_BLOCK = b'\x03'
#     TLV_TERMINATOR_BLOCK = b'\xfe'
#     TLV_SINGLE_BYTE_LENGTH_MAX_SIZE_BYTES = 255
#     TLV_DOUBLE_BYTE_LENGTH_MAX_SIZE_BYTES = 65_535
#     TLV_DOUBLE_LENGTH_PREFIX = b'\xff'

#     @classmethod
#     def from_ndef_message(cls, message):
#         tvl_wrapped_message = cls.wrap_in_tlv(message)
#         ntag_data = cls.justify_to_ntag_size(tvl_wrapped_message)
#         return ntag_data

#     @classmethod
#     def justify_to_ntag_size(cls, ntag_data):
#         cls.validate_ntag_data_size(ntag_data)
#         return ntag_data.ljust(cls.NTAG_SIZE_BYTES, bytes(1))

#     @classmethod
#     def validate_ntag_data_size(cls, ntag_data):
#         if len(ntag_data) > cls.NTAG_SIZE_BYTES:
#             raise ValueError(f'Message too large for {cls.__name__}')

#     @classmethod
#     def wrap_in_tlv(cls, message):
#         length_field = cls.get_length_field(len(message))
#         return cls.TLV_TAG_BLOCK + length_field + message + cls.TLV_TERMINATOR_BLOCK

#     @classmethod
#     def get_length_field(cls, message_length):
#         if message_length > cls.TLV_DOUBLE_BYTE_LENGTH_MAX_SIZE_BYTES:
#             raise ValueError(f'Message too large for {cls.__name__}')
#         elif message_length > cls.TLV_SINGLE_BYTE_LENGTH_MAX_SIZE_BYTES:
#             length_field = cls.TLV_DOUBLE_LENGTH_PREFIX + message_length.to_bytes(2, byteorder='big')
#         else:
#             length_field = message_length.to_bytes(1, byteorder='big')
#         return length_field
