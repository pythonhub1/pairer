import React, {useEffect, useState} from 'react';
import {Button, Stack, TextField, Typography} from '@mui/material';

function App() {
    const [names, setNames] = useState(""); // Names from the TextField
    const [pairs, setPairs] = useState(""); // Pairs to go into the results TextField
    const [pairSeparator, setPairSeparator] = useState(() => {
        const savedSeparator = localStorage.getItem('pairSeparator');
        return savedSeparator !== null ? savedSeparator : '|'; // Default pair separator
    });

    // Effect hook to update localStorage whenever pairSeparator changes
    useEffect(() => {
        localStorage.setItem('pairSeparator', pairSeparator);
    }, [pairSeparator]);

    function handlePair() {
        // Split the 'names' string into an array of names, filtering out empty strings
        const namesArray = names.split("\n").filter(Boolean);

        // Initialize givers and a copy for getters
        const givers = [...namesArray];

        while (true) {
            let num_no_valid_getters = 0
            let getters = [...namesArray];

            const newPairs: string[] = [];

            givers.forEach(giver => {
                // Filter the getters array to exclude the current giver
                const possibleGetters = getters.filter(getter => getter !== giver);

                if (possibleGetters.length > 0) {
                    // Randomly select a getter from the list of possible getters
                    const randomIndex = Math.floor(Math.random() * possibleGetters.length);
                    const getter = possibleGetters[randomIndex];
                    // Add the pair
                    newPairs.push(`${giver}${pairSeparator}${getter}`);

                    // Remove the selected getter from the main getters array to avoid being selected again
                    getters = getters.filter(name => name !== getter);
                } else {
                    // Note that no valid getter was found for the current giver, so we can try again
                    ++num_no_valid_getters
                    console.log("No valid getter found for:", giver);
                }
            });

            if (num_no_valid_getters === 0) {
                // Join the paired names array back into a string, separated by newlines
                setPairs(newPairs.join("\n"));
                break
            }
        }
    }

    function handleCopy() {
        navigator.clipboard.writeText(pairs).then(() => {
        }).catch(err => {
            console.error('Error copying text: ', err);
        });
    }

    return (
        <div className="App">
            <Stack spacing={2} sx={{margin: 'auto', maxWidth: 600}}>
                <Typography variant='h3' sx={{textAlign: 'center'}}>Names Pairer</Typography>
                <TextField
                    label="Names"
                    variant="outlined"
                    multiline
                    rows={10}
                    value={names}
                    onChange={(e) => {
                        setNames(e.target.value)
                    }}
                />
                <TextField
                    label={"Pair Separator"}
                    variant={"outlined"} value={pairSeparator}
                    onChange={(e) => {
                        setPairSeparator(e.target.value)
                    }}
                    sx={{
                        maxWidth: '50%',
                    }}
                />
                <TextField
                    label="Pairing Results"
                    multiline
                    rows={10}
                    inputProps={{readOnly: true}}
                    variant="outlined"
                    value={pairs}
                />
                <Stack direction='row' spacing={1}>
                    <Button variant="contained" onClick={handlePair}>Pair</Button>
                    <Button variant="contained" onClick={handleCopy}>Copy Results</Button>
                </Stack>
            </Stack>
        </div>
    );
}

export default App;
