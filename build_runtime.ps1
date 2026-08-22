cp quartz.config.yaml runtime/
cd runtime
npm ci
npx quartz plugin install --from-config
npx quartz build -d ../content --serve