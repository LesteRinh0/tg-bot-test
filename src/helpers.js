export const commands = {
    isStartCommand: (text) => text === '/start',
    isWeatherCommand: (text) => text === '/weather',
    isRecommendCommand: (text) => text === '/recommend',
    isSubscribeCommand: (text) => text === '/subscribe',
    isUnsubscribeCommand: (text) => text === '/unsubscribe',
    isCatCommand: (text) => text === '/cat',
    isDogCommand: (text) => text === '/dog',
    isHelpCommand: (text) => text === '/help'
  };
  
  export default commands;