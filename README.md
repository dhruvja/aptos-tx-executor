# Aptos Transaction Executor UI

This site helps you to execute the transactions using your wallet in your browser with a friendly UI removing all the complexities. Below is the process on how you can use it.

You can also share the URL which has query params specifying module address, module name and the function to execute.

## Procedure

1. Choose your network
<img width="1727" alt="Screen Shot 2023-01-19 at 8 20 02 PM" src="https://user-images.githubusercontent.com/62325417/213476614-6aaed94d-4535-4c74-9cfe-a3d2b8eb9d41.png">

2. Enter the module address
   It is the account with which the module was deployed.
   
<img width="1728" alt="Screen Shot 2023-01-19 at 8 20 51 PM" src="https://user-images.githubusercontent.com/62325417/213476813-2fc950f6-307c-4ef1-8317-e3ded9d016fa.png">

3. Enter the module name and click fetch

  <img width="1728" alt="Screen Shot 2023-01-19 at 8 20 58 PM" src="https://user-images.githubusercontent.com/62325417/213476871-cd25c60c-cba4-4008-8ca3-86f5241f6ba8.png">

4. All the exposed functions would be shown. You can click on the function u want to execute by providing the right arguments and signing the tx with your connected wallet.

<img width="1728" alt="Screen Shot 2023-01-19 at 8 21 42 PM" src="https://user-images.githubusercontent.com/62325417/213476900-2d3b8215-410d-4267-a956-0ce2bbc4d5c9.png">

## Limitations

- Cannot enter arguments of type vector
- Doesnt show resources
- Doesnt show events
- Shows all the functions instead of only entry functions ( cause non entry functions cannot be called using SDK or API ).

The above features would be added soon.
