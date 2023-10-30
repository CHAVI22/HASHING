#include <bits/stdc++.h>
using namespace std;

int main()
{
    int n, q;
    cin >> n >> q;
    vector<int> arr(n + 1);
    for (int i = 0; i < n; i++)
    {
        cin >> arr[i];
    }

    for (int i = 0; i < n; i++)
    {
        for (int j = 1; j <= n; j++)
        {
            if (arr[i] + arr[j] == q)
            {
                cout << i << " " << j;
                break;
            }
        }
    }
    return 0;
}

// T.c = O(N*Q)
// S.c = O(N)