#!/bin/bash 

TAG="nightly-$1"

echo -e "\033[33mWARNING: THIS WILL DELETE ANY CURRENT FLEET DEPLOYMENTS AND REPLACE THEM\033[0m"
echo -e "\033[33mUSE THIS FOR DEVELOPMENT PURPOSES ONLY\033[0m"

if [ ! -z $1 ]; 
    then 
    if [ $1 = "-h" ] || [ $1 = "--help" ] || [ $1 = "--h" ] || [ $1 = "-help" ]; 
        then 
        echo "Enter a date as an argument to use a specific date, or no argument for yesterday's nightly build"
        echo "EX:"
        echo "  ./deploy-nightly.sh"
        echo "  ./deploy-nightly.sh 2022-04-22"
        exit
    fi
fi

read -p "Are you sure you want to continue (Y/N)? " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

if [ -z $1 ]; then 

    TAG="nightly-$(date -d "yesterday 12:00" '+%Y-%m-%d')"
fi 

cp nightly.yaml.template nightly.yaml 
sed -i "s/FILL_THIS/${TAG}/g" nightly.yaml

kubectl delete --all -n fleet 
kubectl apply -f nightly.yaml 
rm -rf nightly.yaml