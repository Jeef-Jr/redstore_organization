local Tunnel = module("vrp", "lib/Tunnel")
local Proxy = module("vrp", "lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP")

vRP.prepare("vRP/get_blips", "SELECT * FROM redstore_coords")

-- ________________ FUNÇÕES NATIVAS __________________________

local base_summerz = false

-----------------------------------------------------------------------------------------------------------------------------------------
-- USERSYNC
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterNetEvent("emitirNotifySummerz")
AddEventHandler("emitirNotifySummerz", function(id, variavel, mensagem, success, isSource, time)
  if base_summerz then
    local nplayer = isSource and vRP.userSource(id) or vRP.getUserId(tonumber(id))
    if nplayer then
      if success then
        TriggerClientEvent("Notify", nplayer, tostring(variavel), mensagem, tonumber(time) > 0 and time)
      else
        TriggerClientEvent("Notify", nplayer, variavel, mensagem, tonumber(time) > 0 and time)
      end
    end
  end
end)

AddEventHandler('trocarPlacaVeh_summerz', function(id, placa)
    if base_summerz then
        local nplayer = vRP.userSource(tonumber(id))
        if nplayer then
            TriggerClientEvent('trocarPlaca', nplayer, placa)
        end
    end
end)

RegisterNetEvent("spawnCar_summerz")
AddEventHandler("spawnCar_summerz", function(id, vehicle)
    if base_summerz then
        local nplayer = vRP.userSource(tonumber(id))
        if nplayer then
            TriggerClientEvent('spawnarvehicle', nplayer, vehicle)
        end
    end
end)

RegisterNetEvent("pegarCoords_summerz")
AddEventHandler("pegarCoords_summerz", function(id)
    if base_summerz then
        local nplayer = vRP.userSource(tonumber(id))
        if nplayer then
            local x, y, z = vRPclient.getPosition(nplayer)
            playerCoords[id] = { x, y, z }
        end
    end
end)


RegisterNetEvent("getCoords_summerz")
AddEventHandler("getCoords_summerz", function(id, callback)
    if base_summerz then
        local nplayer = vRP.userSource(tonumber(id))
        if nplayer then
            local ped = GetPlayerPed(nplayer)
            local coords = GetEntityCoords(ped)
            local position = { x = mathLegth(coords["x"]), y = mathLegth(coords["y"]), z = mathLegth(coords["z"]) }
            callback(position)
        else
            callback(nil)
        end
    end
end)







RegisterNetEvent('getMoney_summerz')
AddEventHandler('getMoney_summerz', function(id, callback)
    if base_summerz then
        local user_id = tonumber(id)
        local bank = vRP.getBank(user_id)
        callback({ wallet = 0, bank = bank })
    end
end)

RegisterNetEvent('updateMoney_summerz')
AddEventHandler('updateMoney_summerz', function(id, wallet, bank, callback)
    if base_summerz then
        vRP.setNovoValor(id, bank)
        callback(true)
    end
end)
