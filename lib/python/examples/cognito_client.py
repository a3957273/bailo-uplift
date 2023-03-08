"""Example Bailo Client usage with Cognito authentication"""

import datetime
import json
import logging
import os
import sys

from bailoclient import create_cognito_client
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

## Configure client based on local secrets
client = create_cognito_client(
    user_pool_id=os.getenv("COGNITO_USERPOOL"),
    client_id=os.getenv("COGNITO_CLIENT_ID"),
    client_secret=os.getenv("COGNITO_CLIENT_SECRET"),
    region=os.getenv("COGNITO_REGION"),
    url=os.getenv("BAILO_URL"),
)

### Load username from local secrets file
username = os.getenv("COGNITO_USERNAME")
password = os.getenv("COGNITO_PASSWORD")

## Connect to the Bailo instance
client.connect(username=username, password=password)

## Get all models and output their ids
models = client.get_models()
model_uuids = [m.uuid for m in models]


### Get and print a model card #####

## Grab a model card by uuid
model_card = client.get_model_card(model_uuid=model_uuids[0])

users = client.get_users()
user = client.get_user_by_name("user")

## Get one of your models and update it
me = client.get_me()
user_models = client.get_my_models()
model_card = user_models[0]
model_uuid = model_card.uuid

## Print model card as underlying JSON
print(model_card)

## Pretty print model card (indented json)
model_card.display()

### Output pretty print of model card as text
readable_json = model_card.display(to_screen=False)


##### Update a Model and Model Card #####

## Get list of fields within the model card
fields = dir(model_card)
# Tab auto completion works in iPython/Jupyter for fields (and nested fields)
""""
model_card.highLevelDetails.
                                      internallyCreated      name
                                      modelInASentence       securityClassification
                                      modelOverview          tags
"""
## Update a single field
now = datetime.datetime.now()

## Validate the model card
result = model_card.validate()
for error in result.errors:
    print(f"{error.field}: {error.description}")
if result.is_valid:
    print("Our updated model validated against the model schema supplied Bailo!")


## Update the model and model card
update_resp = client.update_model(
    model_card=model_card,
    model_version="new_python_client_version",
    binary_file="../../__tests__/example_models/minimal_model/minimal_binary.zip",
    code_file="../../__tests__/example_models/minimal_model/minimal_code.zip",
)

print(f"Updated model: {update_resp}")

## Create a new model
with open("examples/resources/example_metadata.json") as json_file:
    metadata = json.load(json_file)

uploaded_model = client.upload_model(
    metadata=metadata,
    binary_file="../../__tests__/example_models/minimal_model/minimal_binary.zip",
    code_file="../../__tests__/example_models/minimal_model/minimal_code.zip",
)

print(f"Created new model: {uploaded_model}")

# You can also grab and inspect the model schema used for validation:
schema = client.get_model_schema(model_uuid)


# You can download the code and binary for a model if you have a deployment

user_deployments = client.get_my_deployments()

if user_deployments:
    deployment = user_deployments[0]

    resp = client.download_model_files(
        deployment["uuid"],
        deployment["metadata"]["highLevelDetails"]["initialVersionRequested"],
        file_type="code",
        overwrite=True,
    )


## To get a specific deployment
# deployment = client.find_my_deployment(deployment_name='', model_uuid='', model_version='')

with open("bailoclient/resources/deployment.json", "r") as json_file:
    metadata = json.load(json_file)

client.request_deployment(metadata)
