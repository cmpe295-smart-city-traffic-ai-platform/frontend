VERSION=1.0.0

build-docker-image:
	docker build -t smart-city-traffic-frontend:$(VERSION) --platform=linux/amd64 .

tag-docker-image-aws:
	docker tag smart-city-traffic-frontend:$(VERSION) 319282596033.dkr.ecr.us-east-1.amazonaws.com/smart_city_traffic/smart-city-traffic-frontend:$(VERSION)

push-docker-image-aws:
	docker push 319282596033.dkr.ecr.us-east-1.amazonaws.com/smart_city_traffic/smart-city-traffic-frontend:$(VERSION)

package-build-docker-image-aws: build-docker-image tag-docker-image-aws push-docker-image-aws
