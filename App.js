import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";

export default function App() {
  const [input, setInput] = useState('');
  const [quote, setQuote] = useState(' ');
  const [seconds, setSeconds] = useState(60);
  const [wmp, setWpm] = useState(0);
  const [boolean, setBoolean] = useState(false)
  const [mistake, setMistakes] = useState(0)
  const [accuracy, setAccuracy] = useState(0)

  const quoteApiUrl =
    'https://api.quotable.io/random?minLength=80&maxLength=100';

  const newQuote = () => {
    fetch(quoteApiUrl)
    .then(response => response.json())
    .then(data => {
      setQuote(data.content)
    })
  } 

  const restart = () => {
    newQuote()

    setInput('');
    setSeconds(60);
    setWpm(0);
    setBoolean(false)
    setMistakes(0)
  };

  useEffect(() => {
    restart()
  }, []);
  
  useEffect(() => {
    if (input !== '' && input.length !== quote.length) {
      seconds > 0 && setTimeout(() => setSeconds(seconds - 1), 1000);
    }
  }, [seconds, input, quote]);
  
  useEffect(() => {
    if (input.length === quote.length) {
      setBoolean(true)
    }
  }, [input, quote])

  useEffect(() => {
    if (boolean === true) {
      setBoolean(false)
      const quoteArray = quote.split('')
      const inputArray = input.split('')

      let correctCount = 0;
      let mistakeCount = 0;

      quoteArray.forEach((char, index) => {
        if (char === inputArray[index]) {
          correctCount += 1
        } else {
          mistakeCount += 1
        }
      })

      const timeCompleted = 60 - seconds;
      const multiplier = (60 / timeCompleted).toFixed()
      const wordsTypedCorrectly = ((correctCount - mistakeCount) / 5).toFixed()
      const wordsPerMinute = wordsTypedCorrectly * multiplier
      const typeAccuracy = Math.round(((inputArray.length - mistakeCount) / inputArray.length) * 100)

      setAccuracy(typeAccuracy)
      setWpm(wordsPerMinute)
      setMistakes(mistakeCount)

    }
  }, [boolean, quote, input, mistake, seconds])


  return (
    <View style={styles.container}>
      <StatusBar style='light' />
      <View style={styles.typeContainer}>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 20 }}>
            Time: <Text style={{ fontWeight: 700 }}>{seconds}s</Text>
          </Text>
        </View>

        <Text style={styles.quoteStyle}>{quote}</Text>

        <TextInput
          editable={input.length < quote.length}
          maxLength={quote.length}
          multiline={true}
          style={styles.textInput}
          onChangeText={setInput}
          placeholder='Enter Text'
          value={input}
          autoCorrect={false}
        />
        <Pressable style={styles.buttonStyle} onPress={restart}>
          <Text style={styles.buttonText}>Restart</Text>
        </Pressable>
        {input.length === quote.length || seconds === 0 ? (
          <View>
            <Text style={[styles.stats, {marginTop: 10}]}>Result: <Text style={{fontSize: 17, fontWeight: '600'}}>{wmp.toFixed()}<Text style={{fontSize: 15}}>WPM</Text></Text></Text>
            <Text style={styles.stats}>Accuracy: <Text style={{fontSize: 17, fontWeight: '600'}}>{accuracy}<Text style={{fontSize: 15}}>%</Text></Text></Text>
            <Text style={styles.stats}>Mistakes: <Text style={{fontSize: 17, fontWeight: '600'}}>{mistake}</Text></Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  typeContainer: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 6,
    padding: 20,
  },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    marginTop: 15,
  },
  buttonStyle: {
    backgroundColor: "blue",
    borderRadius: 10,
    margin: 10,
    padding: 10,
    alignSelf: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  quoteStyle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: 'center'
  },
  stats: {
    fontSize: 20,
    fontWeight: "bold",
  },
})
