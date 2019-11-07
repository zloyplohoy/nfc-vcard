FROM python:3.8-alpine

RUN apk add \
    gcc \
    linux-headers \
    make \
    musl-dev

WORKDIR /usr/src/app

COPY src .

RUN pip install -r requirements.txt

CMD ["python3", "api.py"]
