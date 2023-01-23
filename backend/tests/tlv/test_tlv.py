import pytest
from ntag_writer_api.ndef_tlv import TLV
from hypothesis.strategies import binary
from hypothesis import given


NDEF_TAG = b'\x03'
TERMINATOR = b'\xfe'
DOUBLE_BYTE_LENGTH_PREFIX = b'\xff'


def test_tlv_wrap_empty_ndef_data():
    wrapped_data = TLV.wrap(data=b'')
    length = b'\x00'
    assert wrapped_data == NDEF_TAG + length + TERMINATOR


@given(binary(max_size=255))
def test_tlv_wrap_random_single_length_data(data):
    wrapped_data = TLV.wrap(data=data)
    length_field = len(data).to_bytes()
    assert wrapped_data == b''.join([NDEF_TAG, length_field, data, TERMINATOR])


@given(binary(min_size=256, max_size=65_535))
def test_tlv_wrap_random_double_length_data(data):
    wrapped_data = TLV.wrap(data=data)
    length_field = len(data).to_bytes(length=2, byteorder='big')
    assert wrapped_data == b''.join([NDEF_TAG, DOUBLE_BYTE_LENGTH_PREFIX,
                                     length_field, data + TERMINATOR])


@given(binary())
def test_tlv_wrap_random_oversized_data(data):
    with pytest.raises(ValueError):
        random_oversized_data = b''.join([bytes(65_536), data])
        TLV.wrap(data=random_oversized_data)
