CONTAINER_NAME=dailyquest-client
REPOSITORY=barkstone2/dailyquest-client
VERSION=$(cat /home/ec2-user/app/nginx/version.txt)

docker pull $REPOSITORY:"$VERSION"

REMOVE_IMAGE=$(docker images -f "reference=$CONTAINER_NAME" -q)

docker stop $CONTAINER_NAME
docker rm $CONTAINER_NAME

if [ -n "$REMOVE_IMAGE" ]; then
    docker rmi "$REMOVE_IMAGE"
fi

docker tag $REPOSITORY:"$VERSION" $CONTAINER_NAME
docker rmi $REPOSITORY:"$VERSION"

/home/ec2-user/app/nginx/container-start.sh

sleep 10