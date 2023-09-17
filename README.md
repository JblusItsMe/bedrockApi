
# BedrockAPI

The `bedrockapi` Node.js library is a powerful tool for both developers and Minecraft enthusiasts. It provides a simple and efficient way to obtain detailed information about a Minecraft Bedrock Edition server using only its IP address and port. With this library, you can access vital server statistics, player data, and more, making it an essential component for any Minecraft server monitoring or management system.

### Key Features:

**Server Information:** Retrieve essential details about the Minecraft Bedrock server, including its version, MOTD *(Message of the Day)*, IP address, ID *(ping, server)*, and server name.

**Player Data:** Obtain the number of online players and the maximum number of players that the server can accommodate, enabling you to monitor player activity in real-time.

**Server Status**: Quickly check if the server is online and responsive, helping you ensure the availability of your Minecraft world.

---
[Apache License](https://github.com/JblusItsMe/bedrockApi/blob/main/LICENSE)


## Documentation
```javascript
const API = require('bedrockapi');
const api = new API();
const ip = 'play.nethergames.org';
const port = 19132;
```
[Read our full documentation](https://github.com/JblusItsMe/bedrockApi/wiki)


## Installation

Install with npm

```bash
  npm install bedrockapi
```

## API Reference

#### Get all data

```http
  .ping(ip, port, callback, timeout){}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `ip` | `string` | **Required**. Your server adress. |
| `port` | `number` | **Required**. Your server port. |
| `callback` | `function` | **Required**. Function(err, res){} |
| `timeout` | `number` | **Optional**. Response ping (default: 5000). |

#### Get item

```http
  .isOnline(ip, port, callback){}
  .getAckId(ip, port, callback){}
  .getMaxOnline(ip, port, callback){}
  .getOnline(ip, port, callback){}
  .getCleanName(ip, port, callback){}
  .getName(ip, port, callback){}
  .getVersion(ip, port, callback){}
  .getGame(ip, port, callback){}
  .getPingId(ip, port, callback){}
  .getServerId(ip, port, callback){}
  .getIp(ip, port, callback){}
  .getIpFamilly(ip, port, callback){}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `ip` | `string` | **Required**. Your server adress. |
| `port` | `number` | **Required**. Your server port. |
| `callback` | `function` | **Required**. Function(error, result){} |


## Demo

https://github.com/JblusItsMe/bedrockApi/tree/main/test

