#include <bits/stdc++.h>
using namespace std;

int main() {
	int arr[] = {1 , 2, 1, 4, 3, 1};
	int n = 6;

	unordered_map<int, int> ump; // The first int stores the value of the integer and the second int stores its frequency
	for (int i = 0; i < n; ++i) {
		ump[arr[i]]++;
	}

	int maxfreqsofar = 0; //maxfreqsofar is the highest frequency found so far
	for (auto x : ump) {
		// If the frequency of x is greater than maxfreq then x is the current highest frequent element
		if (x.second > maxfreqsofar) {
			maxfreqsofar = x.second;
		}
	}

	cout << "The minimum number of operations required to make all elements equal is: " << (n - maxfreqsofar) << endl;

}