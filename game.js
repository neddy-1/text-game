import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100; // 플레이어의 체력
    this.minAttackPower = 10; // 플레이어의 최소 공격력
    this.maxAttackPower = 30; // 플레이어의 최대 공격력
  }

  attack(monster) {
    const damage = Math.floor(Math.random() * (this.maxAttackPower - this.minAttackPower + 1)) + this.minAttackPower;
    monster.hp -= damage; // 몬스터의 체력 감소
    return damage;
  }

  recoverHealth() {
    this.hp = Math.min(this.hp + 40, 100); // 체력 회복량 및 최대 체력 조정
  }

  increaseAttackPower() {
    const increaseAmount = Math.floor(Math.random() * 11) + 5; // 5에서 15 사이의 랜덤 증가량
    this.minAttackPower += increaseAmount;
    this.maxAttackPower += increaseAmount;
  }
}

class Monster {
  constructor(stage) {
    this.hp = 100 + (stage * 10); // 스테이지에 따른 몬스터의 체력 증가
    this.minAttackPower = 30; // 몬스터의 최소 공격력
    this.maxAttackPower = 40 + stage; // 몬스터의 최대 공격력
  }

  attack(player) {
    const damage = Math.floor(Math.random() * (this.maxAttackPower - this.minAttackPower + 1)) + this.minAttackPower;
    player.hp -= damage; // 플레이어의 체력 감소
    return damage;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== 현재 상태 ===`));
  console.log(
    chalk.cyanBright(`| 스테이지: ${stage} `) +
    chalk.blueBright(`| 플레이어 HP: ${player.hp} | 공격력: ${player.minAttackPower}~${player.maxAttackPower}`) +
    chalk.redBright(`| 몬스터 HP: ${monster.hp} | 공격력: ${monster.minAttackPower}~${monster.maxAttackPower} |`)
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach(log => console.log(log));

    console.log(chalk.green(`\n1. 공격한다 2. 도망친다`));
    const choice = readlineSync.question('당신의 선택은? ');

    switch (choice) {
      case '1': {
        const playerDamage = player.attack(monster);
        logs.push(chalk.green(`플레이어가 몬스터를 공격하여 ${playerDamage}의 피해를 입혔습니다.`));

        if (monster.hp <= 0) {
          logs.push(chalk.yellow('몬스터를 처치했습니다!'));
          return; // 몬스터가 처치되면 전투 종료
        }

        const monsterDamage = monster.attack(player);
        logs.push(chalk.red(`몬스터가 플레이어를 공격하여 ${monsterDamage}의 피해를 입혔습니다.`));

        if (player.hp <= 0) {
          logs.push(chalk.red('플레이어가 패배했습니다! 게임 종료.'));
          return; // 플레이어가 패배하면 전투 종료
        }
        break;
      }

      case '2':
        logs.push(chalk.blue('플레이어가 도망쳤습니다.'));
        return; // 플레이어가 도망치면 전투 종료

      default:
        logs.push(chalk.red('잘못된 선택입니다.'));
    }
  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    if (player.hp <= 0) {
      console.log(chalk.red('게임 오버!'));
      break;
    }

    console.clear(); // 화면 정리

    console.log(chalk.green(`스테이지 ${stage} 클리어!`));
    
    // 스테이지 10이 아닐 때만 체력 회복 및 공격력 증가
    if (stage < 10) {
      player.recoverHealth(); // 스테이지 클리어 시 체력 회복
      player.increaseAttackPower(); // 공격력 증가
      
      // 회복 및 공격력 증가
      console.log(chalk.cyan(`플레이어의 체력이 ${player.hp}로 회복되었습니다.`));
      console.log(chalk.cyan(`플레이어의 공격력이 ${player.minAttackPower}~${player.maxAttackPower}로 증가되었습니다.`));
    }

    // 다음 스테이지로 넘어가기 전 엔터키를 기다리기
    readlineSync.question('계속하려면 엔터를 누르세요...'); 
    
    stage++;
  }

  if (stage > 10) {
    console.log(chalk.cyan('축하합니다! 게임을 클리어했습니다.'));
  }
}
