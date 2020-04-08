import chalk from 'chalk';

const Timing = (startLabel: string = 'default') => {
  const start: number = Date.now();
  console.log(chalk.yellow(`🟡 ${startLabel}...`));
  return (endLabel?: string): number => {
    const end: number = Date.now();
    const duration: number = end - start;
    const label = endLabel || startLabel;
    console.log(chalk.green(`🟢 ${label} (${duration}ms)`));
    return duration;
  };
};

export default Timing;
