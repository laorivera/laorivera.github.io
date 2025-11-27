export class Environments {

constructor(){}

public environment = {
  production: true,
  apiBaseUrl: 'https://extensions-pocket-sake-longitude.trycloudflare.com',
} 

public decode(): string {
  const encoded = 'S@NN3N$AD!';
  return encoded
}
}
