require('config')
require('base64')

pin = 4

gpio.mode(pin, gpio.OUTPUT)

stripLength = 30
ledData = string.char(0, 0, 0):rep(stripLength)
frameSize = stripLength * 3

function leds(r, g, b)
  ledData = string.char(r, g, b)..ledData
  ledData = ledData:sub(1, -2)
  ws2812.writergb(pin, ledData)
end

function raw(ledString)
  ws2812.writergb(pin, ledString:sub(1, frameSize))
end

function animate(delay, framesBin)
  --print("delay: "..delay)
  local len = framesBin:len()
  --print("framesBin length: "..len)
  if (len % frameSize == 0) then
    local frameCount = len / frameSize
    --print("frame count: "..frameCount)
    local currentFrame = 0
    tmr.alarm(1, delay, 1, function()
      --print("current frame: "..currentFrame)
      local start = 1 + currentFrame * frameSize
      --print("start spot: "..start)
      local frame = framesBin:sub(start, start + frameSize - 1)
      --print(frame)
      raw(frame)
      currentFrame = (currentFrame + 1) % frameCount
    end)
  end
end

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
    elseif payload:match("GET /animate/") then
      --print("animate")
      local delay, framesString = payload:match("GET /animate/(%d+)/([A-Za-z0-9+/]*=?=?)")
      if delay and framesString then
        --print("matches")
        tmr.stop(1)
        local binThing = base64.dec(framesString)
        animate(delay, binThing)
      end
    elseif payload:match("GET /raw/") then
      local ledString = payload:match("GET /raw/([A-Za-z0-9+/]*=?=?)")
      if ledString then
        tmr.stop(1)
        raw(base64.dec(ledString))
      end
    end
    conn:send(response)
  end)
  conn:on("sent",function(conn) conn:close() end)
end)

ip = wifi.sta.getip()
print("ledstrip server running on port "..ip..":80...\n")
