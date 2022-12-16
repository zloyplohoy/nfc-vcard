# Install the application
install: install-apt-packages install-ansible


# Install the required system packages with apt
install-apt-packages:
        @echo "Installing system packages..."
        @sudo DEBIAN_FRONTEND=noninteractive apt-get --quiet=2 update
        @sudo apt-get install --quiet=2 python3-dev python3-venv


# Install the application using Ansible installation logic
install-ansible: install-ansible-venv install-ansible-pip install-ansible-playbook


# Create a Python virtual environment for Ansible installation logic
install-ansible-venv:
	@echo "Setting up virtual environment..."
	@python3 -m venv install/ansible/venv


# Install requirements for Ansible installation logic
install-ansible-pip:
	@echo "Installing Ansible..."
	@. install/ansible/venv/bin/activate && \
		pip install --disable-pip-version-check --quiet --requirement ./install/ansible/requirements.txt


# Run the Ansible installation logic playbook
install-ansible-playbook:
	@echo "Running installation playbook..."
	@. install/ansible/venv/bin/activate; \
		ansible-playbook --connection local --inventory localhost, install/ansible/install.yml


# Run tests on the repository
test: test-install test-backend


# Test the installation logic
test-install: test-install-ansible


# Test Ansible installation logic
test-install-ansible: test-install-ansible-venv test-install-ansible-pip test-install-ansible-lint


# Create a Python virtual environment for Ansible installation logic tests
test-install-ansible-venv:
	@python3 -m venv install/ansible/venv-test


# Install requirements for Ansible installation logic tests
test-install-ansible-pip:
	@. install/ansible/venv-test/bin/activate && \
		pip install --disable-pip-version-check --quiet --requirement install/ansible/requirements-test.txt


# Run Ansible Lint over Ansible installation logic
test-install-ansible-lint:
	@. install/ansible/venv-test/bin/activate && \
		ansible-lint install/ansible/install.yml


# Test the backend
test-backend: test-backend-python


# Test backend Python code
test-backend-python: test-backend-python-venv test-backend-python-pip test-backend-python-pylama


# Create a Python virtual environment for backend tests
test-backend-python-venv:
	@python3 -m venv backend/venv-test


# Install requirements for Python code tests
test-backend-python-pip:
	@. backend/venv-test/bin/activate && \
		pip install --disable-pip-version-check --quiet --requirement backend/requirements-test.txt


test-backend-python-pylama:
	@. backend/venv-test/bin/activate && \
		pylama backend/src
