// mutation discountAutomaticBasicCreate($automaticBasicDiscount: DiscountAutomaticBasicInput!) {
//     discountAutomaticBasicCreate(automaticBasicDiscount: $automaticBasicDiscount) {
//       automaticDiscountNode {
//         id
//         automaticDiscount {
//           ... on DiscountAutomaticBasic {
//             startsAt
//             endsAt
//             minimumRequirement {
//           ... on DiscountMinimumSubtotal {
//            greaterThanOrEqualToSubtotal {
//                  amount
//                  currencyCode
//            }
//            }
//          }
//             customerGets {
//               value {
//                 ... on DiscountAmount {
//                   amount {
//                     amount
//                     currencyCode
//                   }
//                   appliesOnEachItem
                  
//                 }
//               }
//               items {
//                 ... on AllDiscountItems {
//                   allItems
//                 }
//               }
//             }
//           }
//         }
//       }
//       userErrors {
//         field
//         code
//         message
//       }
//     }
//   }`,
//   {
// variables: {
//   automaticBasicDiscount: {
//     title: discountTitle,
//     startsAt,
//     endsAt,
//     minimumRequirement: {
//       subtotal: {
//         greaterThanOrEqualToSubtotal: minimumRequirementSubtotal,
//       },
//     },
//     customerGets: {
//       value: {
//         discountAmount: {
//           amount: discountAmount,
//           appliesOnEachItem: false,
//         },
//       },
//       items: {
//         all: true,
//       },
//     },
//  },
// }
// });