const problems = [
  {
    id: 1,
    title: "1. Two Sum",
    difficulty: "Easy",
    acceptance: "49.2%",
    category: "Array, Hash Table",
    likes: "145K",
    dislikes: "4.7K",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: ""
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: ""
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    defaultCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your code here
    
};`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your code here
        pass`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        
    }
};`
    },
    testCases: [
      { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
      { nums: [3, 2, 4], target: 6, expected: [1, 2] },
      { nums: [3, 3], target: 6, expected: [0, 1] }
    ]
  },
  {
    id: 2,
    title: "20. Valid Parentheses",
    difficulty: "Easy",
    acceptance: "41.5%",
    category: "String, Stack",
    likes: "21.3K",
    dislikes: "1.3K",
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: ""
      },
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: ""
      },
      {
        input: 's = "(]"',
        output: "false",
        explanation: ""
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    defaultCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    // Write your code here
    
};`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        # Write your code here
        pass`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        // Write your code here
        
    }
};`
    },
    testCases: [
      { s: "()", expected: true },
      { s: "()[]{}", expected: true },
      { s: "(]", expected: false }
    ]
  },
  {
    id: 3,
    title: "53. Maximum Subarray",
    difficulty: "Medium",
    acceptance: "50.4%",
    category: "Array, Dynamic Programming",
    likes: "32.1K",
    dislikes: "1.3K",
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
      },
      {
        input: 'nums = [1]',
        output: '1',
        explanation: 'The subarray [1] has the largest sum 1.'
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    defaultCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
    // Write your code here
    
};`,
      python: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        # Write your code here
        pass`,
      cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Write your code here
        
    }
};`
    },
    testCases: [
      { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4], expected: 6 },
      { nums: [1], expected: 1 },
      { nums: [5, 4, -1, 7, 8], expected: 23 }
    ]
  }
];

module.exports = problems;
