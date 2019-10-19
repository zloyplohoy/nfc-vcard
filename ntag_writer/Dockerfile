FROM python:3.7 AS build-env

#RUN apk --update add gcc musl-dev

ADD app /app

RUN pip3 install -r /app/requirements.txt

WORKDIR /app

CMD ["python3", "app.py"]
