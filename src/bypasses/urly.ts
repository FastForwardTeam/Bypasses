import { Bypass, safelyNavigate } from "../fastforward"

Bypass(/ur\.ly|urly\.mobi/, () => {
    const path = location.pathname
    if (path.length > 2 && !path.startsWith("/goii/")) {
        safelyNavigate("/goii/" + path.slice(2) + "?ref=" + location.hostname + path)
    }
})
