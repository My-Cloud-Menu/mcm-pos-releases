#!/bin/bash


ecrRepositoryName="mcm-pos"
clusterName="mcm-Cluster"
serviceName="mcm-Pos-Prod"


# Authenticate with AWS ECR
aws ecr get-login-password --region us-east-1 | sudo docker login --username AWS --password-stdin 066947626131.dkr.ecr.us-east-1.amazonaws.com

# Build the Docker image
sudo docker build -t $ecrRepositoryName .

# Tag the Docker image with the ECR repository URL
sudo docker tag $ecrRepositoryName:latest 066947626131.dkr.ecr.us-east-1.amazonaws.com/$ecrRepositoryName:latest

# Push the Docker image to AWS ECR
sudo docker push 066947626131.dkr.ecr.us-east-1.amazonaws.com/$ecrRepositoryName:latest

echo "Container pushed to ECR successfully."

aws ecs update-service --cluster $clusterName --service $serviceName --force-new-deployment --output text

echo "Congratulations! The deployment has been initiated successfully. 🚀🚀🚀"