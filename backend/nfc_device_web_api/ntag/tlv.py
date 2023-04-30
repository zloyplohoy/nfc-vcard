class TLV:
    @classmethod
    def wrap(cls, data):
        ndef_message_type_tag = b'\x03'
        length_field = cls._get_length_field(data)
        terminator = b'\xfe'
        return b''.join([ndef_message_type_tag, length_field, data, terminator])

    @classmethod
    def _get_length_field(cls, data):
        if cls._length_fits_in_one_byte(data):
            length_field = cls._get_single_byte_length_field(data)
        elif cls._length_fits_in_two_bytes(data):
            length_field = cls._get_double_byte_length_field(data)
        else:
            raise ValueError('Data too large to fit into a TLV container')
        return length_field

    @staticmethod
    def _length_fits_in_one_byte(data):
        return len(data) < 256

    @staticmethod
    def _length_fits_in_two_bytes(data):
        return len(data) < 65_535

    @classmethod
    def _get_single_byte_length_field(cls, data):
        return cls._get_length_as_bytes(data, length_size_in_bytes=1)

    @classmethod
    def _get_double_byte_length_field(cls, data):
        double_byte_length_prefix = b'\xff'
        length_field = cls._get_length_as_bytes(data, length_size_in_bytes=2)
        return b''.join([double_byte_length_prefix, length_field])

    @staticmethod
    def _get_length_as_bytes(data, length_size_in_bytes):
        return len(data).to_bytes(length=length_size_in_bytes, byteorder='big')
