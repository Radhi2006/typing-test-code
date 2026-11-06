// @codetype medium | Property delegation with lazy and observable
import kotlin.properties.Delegates

class Settings {
    val config: Map<String, String> by lazy {
        println("Loading config...")
        mapOf("theme" to "dark", "font" to "JetBrains Mono")
    }

    var fontSize: Int by Delegates.observable(14) { _, old, new ->
        println("fontSize changed $old -> $new")
    }
}

fun main() {
    val settings = Settings()
    println(settings.config["theme"])
    settings.fontSize = 16
}
