#include <bits/stdc++.h>
using namespace std;
int main()
{
    map<int, string> Students;

    Students[1] = "Vibhu";
    Students[2] = "Yash";
    Students[3] = "Abhi";
    Students[4] = "Neelam";


                                             /* Capacity: */

    // 1. EMPTY() ---> To determine whether the map is empty or not.
    // Syntax : mapname.empty()
    // Time Complexity : O(1)
    if (Students.empty())
    {
       cout<<"Map is empty:"<<"True";
    }
    else
    {
       cout<<"Map is not empty:"<<"False";
    }
      cout<<endl;

    // 2. max_size() --> To determine the maximum size of the map.
    // Syntax:  map_name.max_size()
    // Time Complexity –  Constant O(1)
    cout<<"Max size can map have is:"<<Students.max_size()<<endl;

   // 3. size()	To determine number of elements in the map.
   // Syntax: map_name.size()
   // Time complexity: Constant i.e. O(1)
   cout<<"Number of elements present in the map:"<<Students.size()<<endl;

   
    return 0;
}
