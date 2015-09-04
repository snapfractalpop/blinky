require('config')
require('base64')

pin = 4

gpio.mode(pin, gpio.OUTPUT)

stripLength = 30
ledData = string.char(0, 0, 0):rep(stripLength)

function leds(r, g, b)
  ledData = string.char(r, g, b)..ledData
  ledData = ledData:sub(1, -2)
  --ws2812.writergb(pin, "\0\0\0")ws2812.writergb(pin, ledData)
  ws2812.writergb(pin, ledData)
end

function raw(ledString)
  ws2812.writergb(pin, ledString:sub(1, stripLength * 3))
end


--[[
isOn = false

function toggle()
  if (isOn) then
    isOn = false
    gpio.write(pin, gpio.LOW)
  else
    isOn = true
    gpio.write(pin, gpio.HIGH)
  end
end
--]]

wifi.setmode(wifi.STATION)
wifi.sta.config(SSID, PASS)

-- A simple http server
srv=net.createServer(net.TCP)
srv:listen(80,function(conn)
  conn:on("receive",function(conn,payload)
    local response = "HTTP/1.1 200 OK\nAccess-Control-Allow-Origin:*\n"
    if payload:match("GET /rgb/") then
      r, g, b = payload:match("GET /rgb/(%d+)/(%d+)/(%d+)/")
      if r and g and b then
        leds(tonumber(r), tonumber(g), tonumber(b))
        response = response.."<h1>"..r..", "..g..", "..b.."</h1>"
      else
        response = "error"
      end
    elseif payload:match("GET /raw/") then
      local ledString = payload:match("GET /raw/([A-Za-z0-9+/]*=?=?)")
      if ledString then
        print(ledString)
        raw(base64.dec(ledString))
      end
    end
    conn:send(response)
  end)
  conn:on("sent",function(conn) conn:close() end)
end)
print("ledstrip server running on port 80...\n")
