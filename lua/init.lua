function kill() tmr.stop(0) end

tmr.alarm(0, 5 * 1000, 0, function() pcall(require, 'blinky') end)

print("Waiting to start server... kill() to stop.")
