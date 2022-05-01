// import Accounts from '../Components/Accounts/Accounts';
// import AccountsByRoutes from '../Components/Accounts/AccountsByRoutes';
// import AccountsByMarkets from '../Components/Accounts/AccountsByMarkets';
// import AllAccounts from '../Components/Accounts/AllAccounts';
// import Routes from '../Components/Routes/Routes';
// import Markets from '../Components/Markets/Markets';
// import Transactions from '../Components/Transactions/Transactions';
// import Summary from '../Components/SummaryPage/Summary';
//
// import TransactionsByMarket from '../Components/Transactions/TransactionsByMarket';
// import TransactionsByRoute from '../Components/Transactions/TransactionsByRoute';
// import TransactionsByAccount from '../Components/Transactions/TransactionsByAccount';
//
//
// const presentationComponents = () => {
//     return [
//         {
//             title: 'Summary',
//             expandable: false,
//             path: 'summary',
//             component: <Summary />
//         },
//         {
//             title: 'Markets',
//             expandable: false,
//             path: 'markets',
//             component: <Markets/>
//         },
//         {
//             title: 'Routes',
//             expandable: false,
//             path: 'routes',
//             component: <Routes/>
//         },
//         {
//             title: 'Accounts',
//             expandable: true,
//             path: 'accounts',
//             defaultComponent: 'all-accounts',
//             component: <Accounts />,
//             subItems: [
//                 {
//                     title: "By Market",
//                     expandable: false,
//                     path: 'by-market',
//                     component: <AccountsByMarkets />
//                 },
//                 {
//                     title: "By route",
//                     expandable: false,
//                     path: 'by-route',
//                     component: <AccountsByRoutes />
//
//                 },
//                 {
//                     title: "All Accounts",
//                     expandable: false,
//                     path: 'all-accounts',
//                     component: <AllAccounts />
//                 }
//             ]
//         },
//         {
//             title: 'Transactions',
//             expandable: true,
//             path: 'transactions',
//             defaultComponent: 'transactions-summary',
//             component: <Transactions />,
//             subItems: [
//                 {
//                     title: "By account",
//                     expandable: false,
//                     path: 'by-account',
//                     component: <TransactionsByAccount />
//
//                 },
//                 {
//                     title: "By route",
//                     expandable: false,
//                     path: 'by-route',
//                     component: <TransactionsByRoute />
//
//                 },
//                 {
//                     title: "By Market",
//                     expandable: false,
//                     path: 'by-market',
//                     component: <TransactionsByMarket />
//                 },
//             ]
//         },
//     ];
// };
//
//
// const containerComponents = (props) => {
//     return [
//         {
//             title: 'Activities',
//             expandable: false,
//             path: 'activities',
//             component: <Transactions />
//         }
//     ];
// };
//
// export {presentationComponents, containerComponents};
