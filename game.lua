local game = {}

function game.generateRandomColor()
    return {
        r = math.random(0, 255),
        g = math.random(0, 255),
        b = math.random(0, 255)
    }
end

function game.colorsAreEqual(c1, c2)
    return c1.r == c2.r and c1.g == c2.g and c1.b == c2.b
end

function game.shuffleArray(arr)
    for i = #arr, 2, -1 do
        local j = math.random(i)
        arr[i], arr[j] = arr[j], arr[i]
    end
    return arr
end

function game.generateColorOptions(targetColor)
    local options = {targetColor}
    while #options < 6 do
        local newColor = game.generateRandomColor()
        local isDuplicate = false
        for _, color in ipairs(options) do
            if game.colorsAreEqual(color, newColor) then
                isDuplicate = true
                break
            end
        end
        if not isDuplicate then
            table.insert(options, newColor)
        end
    end
    return game.shuffleArray(options)
end

return game
