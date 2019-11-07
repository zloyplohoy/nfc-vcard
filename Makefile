install: venv requirements ansible

venv:
	python3 -m venv venv && \
	. venv/bin/activate && \
	pip install wheel

requirements:
	. venv/bin/activate && \
	pip install -r requirements.txt

ansible:
	. venv/bin/activate && \
	ansible-playbook -i inventory.txt playbook.yml

start:
	. venv/bin/activate && \
	ansible-playbook -i inventory.txt playbook.yml -t start

build:
	. venv/bin/activate && \
	ansible-playbook -i inventory.txt playbook.yml -t build
