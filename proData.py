import sys
import pandas as pd
import json
# Takes first name and last name via command
# line arguments and then display them

def getScore(df):
    scorelist={}
    for name in df["uname"].unique():
        scorelist[name]=sum(df[df["uname"]==name]["reinforcement"])
        return scorelist

def restruct(df):
    root={"root":None,"scoreboard":None}
    shl={}
    for sh in ['sq','tr','di','ci']:
        #print("Shape",sh)
        extract=df[df["shape"]==sh]
        grl={}
        for gr in [0,1]:
            #print("Group",gr)
            extract0=extract[extract["treatment"]==gr]
            expl={}
            for exp in [1,2,3]:
                #print("Exp",exp)
                extract1=extract0[extract0["experiment"]==exp]
                phl={}
                for ph in [1,2,3,4,5,6]:
                    #print("Phase",ph)
                    extract2=extract1[extract1["phase"]==ph]
                    sub=phase(extract2)
                    phl[ph]=sub
                expl[exp]=phl
            grl[gr]=expl
        shl[sh]=grl
    scorelist={}
    for name in df["uname"].unique():
        scorelist[name]=sum(df[df["uname"]==name]["reinforcement"])
    root["root"]=shl
    root["scoreboard"]=scorelist
    return json.dumps(root)

def phase(dt):
    freq={}
    for ss in [1,2,3,4,5,6]:
        freq[ss]=len(dt[dt["session"]==ss].index)
    return freq

data=sys.argv[1]
#print(data)
son = json.loads(data)
df = pd.json_normalize(son)
tosend=restruct(df)
#f=open("record.txt","w")
#f.write(tosend)
#f.close()
print(tosend)
