FROM python:3.8
WORKDIR /usr/src/app

COPY src/* .

RUN pip install -r /app/requirements.txt

CMD ["python3", "api.py"]
