import pandas as pd
import json
import sys, getopt
import jieba

def main(inputcsv):

	df = pd.read_csv(inputcsv)

	for i, row in df.iterrows():
    	df.loc[i, 'cn_split'] = " ".join(jieba.cut(str(row.cn)))

    name = inputcsv[:-4] + "_segmented.csv"

	df.to_csv(name)

if __name__ == "__main__":
	main(sys.argv[1])
