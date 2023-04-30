from abc import ABC, abstractmethod
from .tlv import TLV


class BaseNTAG(bytes, ABC):
    @property
    @abstractmethod
    def SIZE_BYTES():
        pass

    def __new__(self, data=b''):
        tlv_wrapped_data = TLV.wrap(data)
        self._validate_size(tlv_wrapped_data)
        tag_bytes = self._justify_to_tag_size(tlv_wrapped_data)
        return super().__new__(self, tag_bytes)

    @classmethod
    def _validate_size(cls, data):
        if len(data) > cls.SIZE_BYTES:
            raise ValueError(f'Data too large to fit into {cls.__name__ }')

    @classmethod
    def _justify_to_tag_size(cls, data):
        return data.ljust(cls.SIZE_BYTES)
