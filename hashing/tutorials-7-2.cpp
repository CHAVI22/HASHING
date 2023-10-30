#include <bits/stdc++.h>

using namespace std;

bool checkDuplicatesWithinK(int arr[], int n, int k)
{
    // Creates an empty unordered map
    unordered_map<int, int> umap;

    for (int i = 0; i < n; i++) // start traversing  the array from left to right
    {
        if (umap.find(arr[i]) == umap.end()) // if the element is not present in map then insert it
        {
            umap[arr[i]] = i;
        }

        else // if it is already present then check the condition
        {       
            if (i - umap[arr[i]] <= k)
            {
                return true; // if duplicate present within a distance k
            }
            umap[arr[i]] = i;
        }
    }

    return false; // if the duplicate is not present
}

int main()
{
    int arr[] = {1, 2, 3, 4, 1, 2, 3, 4};
    int n = sizeof(arr) / sizeof(arr[0]);
    if (checkDuplicatesWithinK(arr, n, 3))
        cout << "Yes";
    else
        cout << "No";
}