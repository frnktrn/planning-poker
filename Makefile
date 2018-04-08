.PHONY: install-deps-% dev-up

NODE_IMAGE=node:9.10.1
WP_PORT=9000
WS_PORT=9001

install-deps-%:
	@docker run \
		-it \
		--rm \
		-u $$(id -u) \
		-w /node/src \
		-v $$(pwd)/_build/.cache/yarn:/.cache/yarn \
		-v $$(pwd)/$*/.yarnrc:/.yarnrc \
		-v $$(pwd)/$*:/node/src \
		$(NODE_IMAGE) \
		yarn install

dev-up: install-deps-client install-deps-server
	@USER_ID=$$(id -u) \
         WP_PORT=$(WP_PORT) \
         WS_PORT=$(WS_PORT) \
		docker-compose up
