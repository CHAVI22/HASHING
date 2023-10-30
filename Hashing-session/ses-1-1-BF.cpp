#include <bits/stdc++.h>
using namespace std;

int main()
{
    int n, q;
    cin >> n >> q;
    vector<int> arr(n + 1);
    for (int i = 1; i <= n; i++)
    {
        cin >> arr[i];
    }

    vector<int> freq(n + 1, 0);
    for (int i = 1; i <= n; i++)
    {
        freq[arr[i]]++;
    }

    for (int i = 1; i <= q; i++)
    {
        int x;
        cin >> x;
        cout << freq[x] << " ";
    }
    return 0;
}

//T.c = O(N*Q)
//S.c = O(N)