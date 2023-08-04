fx_version 'adamant'
game 'gta5'

author 'ReeDz'
description 'Script da RedStore'
version '1.0.0'

client_scripts {
	'@vrp/lib/utils.lua',
	'client.lua',
	'core/org/creative/client.lua'
}

server_scripts {
	"@vrp/lib/utils.lua",
	"server.lua",
	"creative_network.lua",
	"creative_summerz.lua",
	'core/org/creative/server.lua',
	"server.js"
}
