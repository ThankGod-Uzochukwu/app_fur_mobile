import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [firstValue, setFirstValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);

  const formatValue = (value: number) => {
    const text = String(value);
    return text.endsWith('.0') ? text.slice(0, -2) : text;
  };

  const handleNumber = (num: string) => {
    if (waitingForSecond) {
      setDisplay(num);
      setWaitingForSecond(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    const currentValue = parseFloat(display);

    if (firstValue === null) {
      setFirstValue(currentValue);
    } else if (operator) {
      const result = calculate(firstValue, currentValue, operator);
      setDisplay(String(result));
      setFirstValue(result);
    }

    setOperator(op);
    setWaitingForSecond(true);
  };

  const calculate = (a: number, b: number, op: string) => {
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '×') return a * b;
    if (op === '÷') return b === 0 ? 0 : a / b;
    return b;
  };

  const handleEquals = () => {
    if (operator && firstValue !== null) {
      const result = calculate(firstValue, parseFloat(display), operator);
      setDisplay(String(result));
      setFirstValue(null);
      setOperator(null);
      setWaitingForSecond(false);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecond(false);
  };

  const renderButton = (
    label: string,
    onPress: () => void,
    variantStyle: object = {},
    textStyle: object = {}
  ) => (
    <Pressable
      style={({ pressed }) => [styles.button, variantStyle, pressed && styles.buttonPressed]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, textStyle]}>{label}</Text>
    </Pressable>
  );

  const expression =
    firstValue !== null && operator
      ? waitingForSecond
        ? `${formatValue(firstValue)} ${operator}`
        : `${formatValue(firstValue)} ${operator} ${display}`
      : '';

  return (
    <View style={styles.container}>
      <View style={[styles.ambientBlob, styles.blobTop]} />
      <View style={[styles.ambientBlob, styles.blobBottom]} />

      <View style={styles.calculatorShell}>
        <View style={styles.gloss} />

        <View style={styles.displayPanel}>
          <Text style={styles.expression}>{expression || ' '}</Text>
          <Text style={styles.display} numberOfLines={1} adjustsFontSizeToFit>
            {display}
          </Text>
        </View>

        <View style={styles.row}>
          {renderButton('C', handleClear, styles.clear, styles.clearText)}
          {renderButton('÷', () => handleOperator('÷'), styles.operator)}
          {renderButton('×', () => handleOperator('×'), styles.operator)}
          {renderButton('-', () => handleOperator('-'), styles.operator)}
        </View>

        <View style={styles.row}>
          {renderButton('7', () => handleNumber('7'))}
          {renderButton('8', () => handleNumber('8'))}
          {renderButton('9', () => handleNumber('9'))}
          {renderButton('+', () => handleOperator('+'), styles.operator)}
        </View>

        <View style={styles.row}>
          {renderButton('4', () => handleNumber('4'))}
          {renderButton('5', () => handleNumber('5'))}
          {renderButton('6', () => handleNumber('6'))}
          {renderButton('=', handleEquals, styles.equals, styles.equalsText)}
        </View>

        <View style={styles.row}>
          {renderButton('1', () => handleNumber('1'))}
          {renderButton('2', () => handleNumber('2'))}
          {renderButton('3', () => handleNumber('3'))}
        </View>

        <View style={styles.row}>
          {renderButton('0', () => handleNumber('0'), styles.zero)}
          {renderButton('.', () => handleNumber('.'))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1a',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 18,
    paddingTop: 56,
    overflow: 'hidden'
  },
  ambientBlob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.5
  },
  blobTop: {
    width: 280,
    height: 280,
    top: -70,
    right: -80,
    backgroundColor: 'rgba(140, 211, 255, 0.28)'
  },
  blobBottom: {
    width: 320,
    height: 320,
    bottom: -100,
    left: -110,
    backgroundColor: 'rgba(120, 154, 255, 0.2)'
  },
  calculatorShell: {
    borderRadius: 30,
    padding: 14,
    backgroundColor: 'rgba(179, 201, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.24)',
    shadowColor: '#7fb4ff',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.22,
    shadowRadius: 30,
    elevation: 16
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '52%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  },
  displayPanel: {
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(7, 12, 24, 0.48)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)'
  },
  display: {
    color: '#f8fbff',
    fontSize: 56,
    fontWeight: '300',
    textAlign: 'right',
    letterSpacing: 1
  },
  expression: {
    color: 'rgba(230, 240, 255, 0.72)',
    fontSize: 19,
    textAlign: 'right',
    marginBottom: 8,
    minHeight: 24
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8
  },
  button: {
    flex: 1,
    minHeight: 74,
    backgroundColor: 'rgba(16, 27, 48, 0.58)',
    margin: 4,
    borderRadius: 20,
    alignItems: 'center'
    ,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#95c3ff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: 'rgba(28, 43, 72, 0.75)'
  },
  buttonText: {
    color: '#f2f7ff',
    fontSize: 28,
    fontWeight: '500'
  },
  clear: {
    backgroundColor: 'rgba(255, 126, 126, 0.22)',
    borderColor: 'rgba(255, 195, 195, 0.42)'
  },
  clearText: {
    color: '#ffd9d9'
  },
  operator: {
    backgroundColor: 'rgba(95, 178, 255, 0.24)',
    borderColor: 'rgba(180, 223, 255, 0.5)'
  },
  equals: {
    backgroundColor: 'rgba(102, 255, 204, 0.26)',
    borderColor: 'rgba(177, 255, 226, 0.52)'
  },
  equalsText: {
    color: '#d8fff0'
  },
  zero: {
    flex: 2
  }
});
