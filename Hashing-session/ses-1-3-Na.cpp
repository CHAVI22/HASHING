#include <bits/stdc++.h>
using namespace std;

int main()
{
    int n, q;
    cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++)
    {
        cin >> arr[i];
    }

    vector<int> prefixsum(n, 0);
    for (int i = 0; i < n; i++)
    {
        prefixsum[i] = prefixsum[i - 1] + arr[i];
    }
    cin >> q;
    int l, r;
    vector<int> ans;
    int res;
    for (int i = 0; i < q; i++)
    {
        cin >> l >> r;
        res=prefixsum[r] - prefixsum[l - 1];
        ans.push_back(res);
    }
    for(int i=0;i<ans.size();i++){
        cout<<ans[i]<<endl;
    }
    return 0;
}
