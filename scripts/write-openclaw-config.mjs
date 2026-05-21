import fs from 'node:fs';

const env = process.env;

for (const key of ['OPENCLAW_GATEWAY_TOKEN', 'BROWSER_TOKEN', 'SERVICE_FQDN_OPENCLAW']) {
  if (!env[key]) {
    console.error(`Missing required env var: ${key}`);
    process.exit(1);
  }
}

const adminTelegram = env.TELEGRAM_ADMIN_ID ? [`tg:${env.TELEGRAM_ADMIN_ID}`] : [];

const config = {
  gateway: {
    mode: 'local',
    auth: {
      mode: 'token',
      token: env.OPENCLAW_GATEWAY_TOKEN,
    },
    bind: 'lan',
    controlUi: {
      allowedOrigins: [
        'http://localhost:18789',
        'http://127.0.0.1:18789',
        `https://${env.SERVICE_FQDN_OPENCLAW}`,
      ],
    },
  },
  tools: {
    profile: 'coding',
    elevated: {
      enabled: true,
      allowFrom: {
        webchat: ['*'],
        telegram: adminTelegram,
      },
    },
    exec: {
      notifyOnExit: true,
    },
  },
  browser: {
    enabled: true,
    defaultProfile: 'browserless',
    ssrfPolicy: {
      dangerouslyAllowPrivateNetwork: true,
    },
    remoteCdpTimeoutMs: 7000,
    remoteCdpHandshakeTimeoutMs: 12000,
    profiles: {
      browserless: {
        cdpUrl: `ws://browser:3000?token=${env.BROWSER_TOKEN}`,
        attachOnly: true,
        color: '#00AA00',
      },
    },
  },
  agents: {
    defaults: {
      thinkingDefault: 'medium',
    },
    list: [
      {
        id: 'main',
        name: 'Main',
        default: true,
        tools: {
          elevated: {
            enabled: true,
            allowFrom: {
              webchat: ['*'],
              telegram: adminTelegram,
            },
          },
        },
      },
    ],
  },
};

if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_ADMIN_ID) {
  config.channels = {
    telegram: {
      enabled: true,
      botToken: env.TELEGRAM_BOT_TOKEN,
      dmPolicy: 'allowlist',
      allowFrom: adminTelegram,
      replyToMode: 'first',
      actions: {
        reactions: true,
        sendMessage: true,
      },
    },
  };
}

fs.writeFileSync('/tmp/openclaw.json', `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 });
console.log('Wrote /tmp/openclaw.json');
