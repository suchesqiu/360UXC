dir=$PWD; 

sh -c "cd $dir/docs/tools && sh generate_yuidoc_for_uxc.sh";

sh -c "cd $dir/uxc && node nodejs_merge.js";
sh -c "cd $dir/uxc/comps/Panel && node nodejs_merge.js";

echo $dir;
