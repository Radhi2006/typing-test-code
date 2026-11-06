// @codetype easy | Thread-safe lazy singleton with a holder class
public final class Config {
    private Config() {
        System.out.println("Loading configuration...");
    }

    private static class Holder {
        private static final Config INSTANCE = new Config();
    }

    public static Config getInstance() {
        return Holder.INSTANCE;
    }
}
