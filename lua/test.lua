test = base64.enc("this is a test")

test = "GET /raw/"..test

isit = test:match("GET /raw/([A-Za-z0-9+/]*=?=?)$")

doneplease = base64.dec(isit)

print(doneplease)

