from flask import Flask
from flask_restful import Api, Resource, reqparse
from ntag_writer import NTAGWriter, NTAGWriterError
import vobject
import ndef
import uuid

app = Flask(__name__)
api = Api(app)


class Vcard(Resource):
    def get(self):
        device = NTAGWriter()
        try:
            if device.card_in_range:
                return 'Card ready', 200
        except NTAGWriterError as e:
            return e, 500
        return 'Card not found', 404


    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('first_name')
        parser.add_argument('last_name')
        parser.add_argument('phone_number')
        parser.add_argument('phone_personal')
        parser.add_argument('email_address')
        parser.add_argument('email_personal')
        parser.add_argument('organization')
        parser.add_argument('position')
        parser.add_argument('policy')
        args = parser.parse_args()

        print(str(args))

        vcard = vobject.vCard()

        if args['first_name'] and args ['last_name']:
            vcard.add('n')
            vcard.add('fn')
            vcard.n.value = vobject.vcard.Name(family=args['last_name'], given=args['first_name'])
            vcard.fn.value = ' '.join([args['first_name'], args['last_name']])
        elif args['first_name']:
            vcard.add('n')
            vcard.add('fn')
            vcard.n.value = vobject.vcard.Name(given=args['first_name'])
            vcard.fn.value = args['first_name']
        elif args['last_name']:
            vcard.add('n')
            vcard.add('fn')
            vcard.n.value = vobject.vcard.Name(family=args['last_name'])
            vcard.fn.value = args['last_name']

        if args['phone_number']:
            vcard.add('tel')
            #vcard.tel.value = ''.join(['+7', args['phone_number']])
            vcard.tel.value = args['phone_number']
            if args['phone_personal']:
                vcard.tel.type_param = 'CELL'
            else:
                vcard.tel.type_param = 'WORK'

        if args['email_address']:
            vcard.add('email')
            vcard.email.value = args['email_address']
            if args['email_personal']:
                vcard.email.type_param = 'HOME'
            else:
                vcard.email.type_param = 'WORK'

        if args['organization']:
            vcard.add('org')
            vcard.org.value[0] = args['organization']

        if args['position']:
            vcard.add('title')
            vcard.title.value = args['position']

        vcard_newlines = '\n'.join(vcard.serialize().splitlines())

        if args['policy']:
            with open('/srv/www/' + str(uuid.uuid4()) + '.vcf', 'w') as f:
                f.write(vcard_newlines)

        vcard_bytes = bytes(vcard_newlines, 'utf-8')
        ndf_record = ndef.Record(type='text/vcard', name='', data=vcard_bytes)
        ndef_data = b''.join(ndef.message_encoder([ndf_record]))


        device = NTAGWriter()

        try:
            device.write_ndef_message(ndef_data)
        except NTAGWriterError as e:
            return e, 500
        return 'Written', 201

    def delete(self):
        device = NTAGWriter()
        try:
            device.format_ntag()
        except NTAGWriterError as e:
            return e, 500
        return 'Formatted', 200


api.add_resource(Vcard, '/vcard')

app.run(host='0.0.0.0', port=5000, debug=True)
