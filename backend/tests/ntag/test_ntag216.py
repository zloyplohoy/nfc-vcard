import pytest
from hypothesis import given
from hypothesis.strategies import binary
from nfc_device_web_api.ntag import NTAG216
from nfc_device_web_api.ntag import TLV


def test_create_empty_ntag216():
    ntag = NTAG216()
    assert ntag == TLV.wrap(b'').ljust(NTAG216.SIZE_BYTES)


def test_create_empty_ntag216_from_empty_data():
    ntag = NTAG216(b'')
    assert ntag == TLV.wrap(b'').ljust(NTAG216.SIZE_BYTES)


@given(binary(max_size=883))
def test_ntag216_return_bytes(data):
    ntag = NTAG216(data)
    assert ntag == TLV.wrap(data).ljust(NTAG216.SIZE_BYTES)


@given(binary(min_size=884))
def test_ntag216_value_error_if_oversized_data(data):
    with pytest.raises(ValueError):
        ntag = NTAG216(data)
        assert type(ntag) == 'NTAG216'
